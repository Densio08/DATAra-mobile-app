import { MaterialIcons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { BottomNavItem } from '../../components/BottomNavItem';
import { useUser } from '../../context/UserContext';

export default function ProfileScreen() {
    const { phone } = useUser();
    const [activeTab, setActiveTab] = useState('Profile');
    
    // Auth Token (Task 6 preparation)
    const [token, setToken] = useState<string | null>(null);

    // Profile State
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Address Dropdown States
    const [regions, setRegions] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [barangays, setBarangays] = useState<any[]>([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedBarangay, setSelectedBarangay] = useState('');
    const [streetAddress, setStreetAddress] = useState('');

    const handleHistory = () => router.push('/Tabs/history');
    const handleSettings = () => router.push('/Tabs/settings');
    const handleHome = () => router.push('/Tabs/dashboard');
    const handleProfile = () => router.replace('/Tabs/profile');

    useEffect(() => {
        fetchRegions();
        // Since we might not have the token properly stored yet, we skip fetching real profile if no token
        // In a real flow (after Task 6), we get the token from SecureStore or context
    }, []);

    const fetchRegions = async () => {
        try {
            const res = await fetch('https://psgc.gitlab.io/api/regions/');
            const data = await res.json();
            setRegions(data);
        } catch (error) {
            console.error("Error fetching regions", error);
        }
    };

    const fetchCities = async (regionCode: string) => {
        try {
            const res = await fetch(`https://psgc.gitlab.io/api/regions/${regionCode}/cities-municipalities/`);
            const data = await res.json();
            setCities(data);
            setBarangays([]);
        } catch (error) {
            console.error("Error fetching cities", error);
        }
    };

    const fetchBarangays = async (cityCode: string) => {
        try {
            const res = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays/`);
            const data = await res.json();
            setBarangays(data);
        } catch (error) {
            console.error("Error fetching barangays", error);
        }
    };

    const onRegionChange = (itemValue: string) => {
        setSelectedRegion(itemValue);
        setSelectedCity('');
        setSelectedBarangay('');
        if (itemValue) {
            fetchCities(itemValue);
        } else {
            setCities([]);
            setBarangays([]);
        }
    };

    const onCityChange = (itemValue: string) => {
        setSelectedCity(itemValue);
        setSelectedBarangay('');
        if (itemValue) {
            fetchBarangays(itemValue);
        } else {
            setBarangays([]);
        }
    };

    const handleSaveProfile = async () => {
        // Construct full address
        const regionName = regions.find(r => r.code === selectedRegion)?.name || '';
        const cityName = cities.find(c => c.code === selectedCity)?.name || '';
        const brgyName = barangays.find(b => b.code === selectedBarangay)?.name || '';
        
        const fullAddress = `${streetAddress}, ${brgyName}, ${cityName}, ${regionName}`.replace(/^, | ,/g, '').trim();
        
        setLoading(true);
        try {
            // Note: This relies on Task 6 (Auth) being fully completed. For now we use the token if available.
            const headers: any = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            const response = await fetch('http://127.0.0.1:8000/api/profile/', {
                method: 'PUT',
                headers,
                body: JSON.stringify({
                    address: fullAddress,
                }),
            });
            const data = await response.json();
            console.log("Saved directly to backend database:", data);
            alert("Profile saved successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Make sure backend is running and you are authenticated.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0d1320" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircle}>
                        <View style={styles.avatarInner}>
                            <MaterialIcons name="person" size={72} color="#94a3b8" />
                        </View>
                    </View>
                </View>

                {/* E-SIM Badge */}
                <View style={styles.esimRow}>
                    <View style={styles.esimBadge}>
                        <Text style={styles.esimText}>E-SIM</Text>
                    </View>
                    <Text style={styles.phoneNumber}>{phone ? `+${phone}` : '+63 08312035'}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="white" />
                </View>

                {/* Address Form Container */}
                <View style={styles.formContainer}>
                    <Text style={styles.sectionTitle}>Update Address</Text>
                    
                    <Text style={styles.label}>Region</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedRegion}
                            onValueChange={onRegionChange}
                            style={styles.picker}
                            dropdownIconColor="white"
                        >
                            <Picker.Item label="Select Region" value="" color="#94a3b8" />
                            {regions.map((region) => (
                                <Picker.Item key={region.code} label={region.name} value={region.code} color="#0f172a" />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>City/Municipality</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedCity}
                            onValueChange={onCityChange}
                            style={styles.picker}
                            enabled={cities.length > 0}
                            dropdownIconColor="white"
                        >
                            <Picker.Item label="Select City/Municipality" value="" color="#94a3b8" />
                            {cities.map((city) => (
                                <Picker.Item key={city.code} label={city.name} value={city.code} color="#0f172a" />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Barangay</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedBarangay}
                            onValueChange={(val) => setSelectedBarangay(val)}
                            style={styles.picker}
                            enabled={barangays.length > 0}
                            dropdownIconColor="white"
                        >
                            <Picker.Item label="Select Barangay" value="" color="#94a3b8" />
                            {barangays.map((brgy) => (
                                <Picker.Item key={brgy.code} label={brgy.name} value={brgy.code} color="#0f172a" />
                            ))}
                        </Picker>
                    </View>

                    <Text style={styles.label}>Street Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="House/Unit No., Street Name"
                        placeholderTextColor="#94a3b8"
                        value={streetAddress}
                        onChangeText={setStreetAddress}
                    />

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveProfile}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveText}>Save Profile</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Log Out button removed as requested */}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavContainer}>
                <View style={styles.bottomNavWrapper}>
                    <BottomNavItem 
                        iconName="home" 
                        label="HOME" 
                        isActive={activeTab === 'Home'}
                        onPress={handleHome}
                    />
                    <BottomNavItem 
                        iconName="history" 
                        label="HISTORY" 
                        isActive={activeTab === 'History'}
                        onPress={handleHistory} 
                    />
                    <BottomNavItem 
                        iconName="settings" 
                        label="SETTINGS" 
                        isActive={activeTab === 'Settings'}
                        onPress={handleSettings} 
                    />
                    <BottomNavItem 
                        iconName="person-outline" 
                        label="PROFILE" 
                        isActive={activeTab === 'Profile'}
                        onPress={handleProfile} 
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1320',
    },
    scrollContent: {
        paddingTop: 40,
        paddingHorizontal: 28,
        paddingBottom: 110,
        alignItems: 'center',
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarCircle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#dbeafe',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e2e8f0',
    },
    esimRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    esimBadge: {
        backgroundColor: '#334155',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginRight: 8,
    },
    esimText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    phoneNumber: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginRight: 4,
    },
    formContainer: {
        width: '100%',
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerContainer: {
        backgroundColor: '#e2e8f0',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#0f172a',
    },
    input: {
        backgroundColor: '#e2e8f0',
        color: '#0f172a',
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        fontSize: 15,
    },
    saveButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    saveText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bottomNavContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    bottomNavWrapper: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
});
