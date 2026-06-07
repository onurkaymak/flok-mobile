import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "../../store/hooks";
import { signInUser } from "../../store/actions/auth-actions";

interface Props {
  onCreateAccountButton: () => void;
}

const SignInForm = ({ onCreateAccountButton }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const router = useRouter();

  const formSubmitHandler = async () => {
    if (!email || !password) return;
    await dispatch(signInUser({ enteredEmail: email, enteredPassword: password }));
    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 bg-white justify-center px-6 py-12">
        <View className="items-center mb-10">
          <Image
            source={{ uri: "https://i.ibb.co/rcpT5Xb/flok1.png" }}
            style={{ height: 80, width: 160 }}
            resizeMode="contain"
          />
          <Text className="mt-8 text-2xl font-bold text-gray-900 text-center">
            Sign in to your account
          </Text>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Email address
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
            <Text className="text-sm font-medium text-gray-900 mb-2">
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              className="w-full border border-gray-300 rounded-md px-3.5 py-3 text-gray-900 text-sm"
            />
          </View>

          <TouchableOpacity
            className="bg-indigo-600 rounded-md py-3 items-center mt-2"
            onPress={formSubmitHandler}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-sm">Sign in</Text>
          </TouchableOpacity>

          <View className="items-center mt-2">
            <TouchableOpacity onPress={onCreateAccountButton}>
              <Text className="text-indigo-600 font-semibold text-sm">
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInForm;
