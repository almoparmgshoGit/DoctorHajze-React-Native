import { auth } from "@/config/firebase";
import { addBooking } from "@/functions/Firebase";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
interface AddBookingProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

const AddBooking: React.FC<AddBookingProps> = ({ modalVisible, setModalVisible }) => {
    const [selectedClinic, setSelectedClinic] = React.useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const [clinic, setClinic] = React.useState<string>("");
    const [date, setDate] = React.useState<string>("");
    const [note, setNote] = React.useState<string>("");
    const [time, setTime] = React.useState<string>("222");
    const user = auth.currentUser;

    const clinics = ["عيادة القاهرة", "عيادة الجيزة", "عيادة الإسكندرية"];




    const add = async () => {
        const booking = {        // ✅ object مش array
            clinicName: clinic,
            notes: note,
            date: date,
            time: time,

        };
        await addBooking(booking)
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
                                        {clinics.map((clinic, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                className={`px-4 py-3 ${index !== clinics.length - 1 ? 'border-b border-gray-100' : ''} ${selectedClinic === clinic ? 'bg-blue-50' : ''}`}
                                                onPress={() => {
                                                    setSelectedClinic(clinic);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                <Text className={`text-right ${selectedClinic === clinic ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                                                    {clinic}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {/* Date Selection */}
                            <View>
                                <Text className="text-gray-600 font-bold mb-2">التاريخ</Text>
                                <View className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row justify-between items-center">
                                    <Text className="text-gray-400">اختر التاريخ</Text>
                                    <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
                                </View>
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
                                onPress={() => { add(); setModalVisible(false); }}
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