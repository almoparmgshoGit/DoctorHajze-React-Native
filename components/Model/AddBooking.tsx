import { addBooking, auth, getClinics } from "@/functions/Firebase";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
interface AddBookingProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

const AddBooking: React.FC<AddBookingProps> = ({ modalVisible, setModalVisible }) => {
    const [selectedClinic, setSelectedClinic] = React.useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [clinics, setClinics] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [date, setDate] = React.useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [showTimePicker, setShowTimePicker] = React.useState(false);
    const [note, setNote] = React.useState<string>("");

    const user = auth.currentUser;

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            const newDate = new Date(date);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setDate(newDate);
        }
    };

    const fetchClinics = async () => {
        setLoading(true);
        try {
            const data = await getClinics();
            setClinics(data);
        } catch (error) {
            console.error("Error in fetchClinics:", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (modalVisible) {
            fetchClinics();
        }
    }, [modalVisible]);




    const add = async () => {
        if (!selectedClinic) {
            alert("يرجى اختيار العيادة");
            return;
        }
        if (!note) {
            alert("يرجى إدخال ملاحظات");
            return;
        }
        if (!date) {
            alert("يرجى اختيار التاريخ");
            return;
        }

        const booking = {
            clinicName: selectedClinic,
            notes: note,
            date: date.toLocaleDateString('en-GB'), // e.g., 08/03/2026
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), // e.g., 10:00 PM
        };
        await addBooking(booking);
        setClinics([]);
        setSelectedClinic(null);
        setNote("");

        setShowDatePicker(false);
        setShowTimePicker(false);
        setModalVisible(false);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white rounded-t-3xl h-[85%] p-6 shadow-2xl">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6" style={{ direction: 'rtl' }}>
                        <Text className="text-2xl font-bold text-gray-800">حجز موعد جديد</Text>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            className="bg-gray-100 p-2 rounded-full"
                        >
                            <Ionicons name="close" size={24} color="#4b5563" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="gap-6 pb-20" style={{ direction: 'rtl' }}>
                            {/* Clinic Selection (Custom Select) */}
                            <View className="z-50">
                                <Text className="text-gray-600 font-bold mb-2">اختر العيادة</Text>
                                <TouchableOpacity
                                    onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                                >
                                    <Text className={selectedClinic ? "text-gray-800" : "text-gray-400"}>
                                        {selectedClinic || "اختر العيادة من هنا"}
                                    </Text>
                                    <Ionicons name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#9ca3af" />
                                </TouchableOpacity>

                                {isDropdownOpen && (
                                    <View className="bg-white border border-gray-200 rounded-xl mt-2 overflow-hidden shadow-lg absolute top-full w-full z-50">
                                        {loading ? (
                                            <View className="p-4"><Text className="text-center text-gray-500">جاري التحميل...</Text></View>
                                        ) : clinics.length === 0 ? (
                                            <View className="p-4"><Text className="text-center text-gray-500">لا توجد عيادات متاحة</Text></View>
                                        ) : (
                                            clinics.map((clinic: any, index: number) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    className={`px-4 py-3 ${index !== clinics.length - 1 ? 'border-b border-gray-100' : ''} ${selectedClinic === (clinic.name || clinic.clinicName) ? 'bg-blue-50' : ''}`}
                                                    onPress={() => {
                                                        setSelectedClinic(clinic.name || clinic.clinicName);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                >
                                                    <Text className={`text-right ${selectedClinic === (clinic.name || clinic.clinicName) ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                                                        {clinic.name || clinic.clinicName}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Date Selection */}
                            <View>
                                <Text className="text-gray-600 font-bold mb-2">التاريخ</Text>
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(true)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                                >
                                    <Text className="text-gray-800 font-bold">
                                        {date.toLocaleDateString('en-GB')}
                                    </Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-blue-600 font-bold text-xs">تعديل</Text>
                                        <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                                    </View>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        onChange={onDateChange}
                                        minimumDate={new Date()}
                                    />
                                )}
                            </View>

                            {/* Time Selection */}
                            <View>
                                <Text className="text-gray-600 font-bold mb-2">الوقت</Text>
                                <TouchableOpacity
                                    onPress={() => setShowTimePicker(true)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center"
                                >
                                    <Text className="text-gray-800 font-bold">
                                        {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                                    </Text>
                                    <View className="flex-row items-center gap-2">
                                        <Text className="text-blue-600 font-bold text-xs">تعديل</Text>
                                        <Ionicons name="time-outline" size={20} color="#3b82f6" />
                                    </View>
                                </TouchableOpacity>

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="time"
                                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                        is24Hour={false}
                                        onChange={onTimeChange}
                                    />
                                )}
                            </View>

                            {/* Notes */}
                            <View>
                                <Text className="text-gray-600 font-bold mb-2">ملاحظات إضافية</Text>
                                <TextInput
                                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-right h-32"
                                    placeholder="اكتب أي معلومات إضافية هنا..."
                                    multiline
                                    textAlignVertical="top"
                                    value={note}
                                    onChangeText={setNote}
                                />
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                className="bg-blue-600 rounded-xl py-4 items-center mt-4 shadow-lg shadow-blue-500/30"
                                onPress={add}
                            >
                                <Text className="text-white font-bold text-lg">تأكيد الحجز</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
}

export default AddBooking