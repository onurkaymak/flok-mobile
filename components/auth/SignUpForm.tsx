import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "../../store/hooks";
import { createUser } from "../../store/actions/auth-actions";
import type { CreateUserInfo } from "../../types";

const roles = [
  { id: 1, name: "Auto Detailer", value: "AUTO DETAILER" },
  { id: 2, name: "Customer Service Agent", value: "CUSTOMER SERVICE AGENT" },
  { id: 3, name: "Manager", value: "MANAGER" },
];

interface Props {
  onCreateAccount: () => void;
}

const SignUpForm = ({ onCreateAccount }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const formSubmitHandler = async () => {
    if (!name || !email || !password) return;

    const userInfo: CreateUserInfo = {
      enteredName: name,
      enteredEmail: email,
      enteredPassword: password,
      selectedRole: selectedRole.value,
    };

    await dispatch(createUser(userInfo));
    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-white px-6 py-12">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-10">
          Create an account
        </Text>

        <View className="gap-5">
          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Employee Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
              placeholder="Enter your name"
              placeholderTextColor="#9ca3af"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your email"
              placeholderTextColor="#9ca3af"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Min. 6 characters"
              placeholderTextColor="#9ca3af"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <View>
            <Text className="text-sm font-semibold text-gray-900 mb-2">
              Employee Role
            </Text>
            <View className="gap-2">
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => setSelectedRole(role)}
                  activeOpacity={0.7}
                  className={`border rounded-md px-3 py-3 items-center ${
                    selectedRole.id === role.id
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedRole.id === role.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {role.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            className="bg-indigo-600 rounded-md py-3 items-center mt-2"
            onPress={formSubmitHandler}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-sm">
              Create an account
            </Text>
          </TouchableOpacity>

          <View className="items-center mt-2">
            <TouchableOpacity onPress={onCreateAccount}>
              <Text className="text-indigo-600 font-semibold text-sm">
                Back to Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUpForm;
