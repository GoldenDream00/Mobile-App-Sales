import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import Header from "../../../components/Header";
import DropDownPicker from "react-native-dropdown-picker";
import { hp, wp } from "../../../utils";
import Input from "../../../components/Input";
import { Inquiry, Environment } from "react-native-persona";
import { Button } from "../../../components/Themed";
import useCheckToken from "../../helpers/useCheckToken";
import {
  useSubmitApplicationMutation,
  useGetUserMutation,
} from "../../../redux/user/userApiSlice";
import { useLogoutUserMutation } from "../../../redux/auth/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoginUser } from "../../../redux/auth/authSlice";
import MyButton from "../../../components/Button";
import Toast from "react-native-root-toast";
import { tintColorDark } from "../../../constants/Colors";
import { useIsFocused } from "@react-navigation/native";
import { logOut } from "../../../redux/auth/authSlice";
import { CountryPicker } from "react-native-country-codes-picker";

export default function IdentityVerification(props: any) {
  const focused = useIsFocused();
  const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);

  const { setTokens, checkTokenExpiry } = useCheckToken();
  const [submitApplication] = useSubmitApplicationMutation();
  const [getUser, { isLoading }] = useGetUserMutation();
  const [logoutUser, logoutUserResp] = useLogoutUserMutation();
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [countryFlag, setCountryFlag] = useState("");
  const dispatch = useDispatch();

  const [user, setUser] = useState(props?.route?.params?.user);
  const [applicationStatus, setApplicationStatus] = useState(
    props?.route?.params &&
      "applicationStatus" in props?.route?.params?.user == false
      ? "required"
      : props?.route?.params?.user?.applicationStatus == "pending"
      ? "pending"
      : "rejected"
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Student", value: "student" },
    { label: "Employee", value: "employee" },
    { label: "Other", value: "other" },
  ]);
  const [otherValue, setOtherValue] = useState("");
  const [buttonStatus, setButtonStatus] = useState("initial");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    getCurrentUser();
  }, [focused]);
  const getCurrentUser = async () => {
    try {
      const resp = await getUser();

      setUser(resp?.data);
      setApplicationStatus(
        "applicationStatus" in resp?.data
          ? resp?.data?.applicationStatus
          : "required"
      );

      if (resp?.data?.applicationStatus == "approved") {
        dispatch(setLoginUser(resp?.data));
      }
    } catch (error) {}
  };

  const submitApplicationApi = async (inquiryId, status) => {
    const data = {
      professionalStatus: otherValue ? otherValue : value,
      inquiryId,
      phone: `${countryCode}${phone}`,
    };

    try {
      const resp = await submitApplication(data);
      if (resp?.error) {
        Toast.show(resp?.error?.data?.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
        });
      } else {
        setButtonStatus("initial");
        getCurrentUser();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const logoutApi = async () => {
    const data = {
      refreshToken,
    };
    try {
      const resp = await logoutUser(data);

      dispatch(logOut());

      props.navigation.reset({
        index: 0,
        routes: [{ name: "Signin" }],
      });
    } catch (error) {
      console.log("---error--logout-", error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Header
          title={"Identity Verification"}
          // leftButton={() => props.navigation.goBack()}
        />
        {isLoading ? (
          <View style={styles.indicator}>
            <ActivityIndicator size="large" color={tintColorDark} />
          </View>
        ) : (
          <View style={styles.innerContainer}>
            <>
              {applicationStatus == "pending" ? (
                <>
                  <Text style={styles.statusText}>
                    Your application to become a verified seller has been
                    successfully submitted. Please wait for our team to take a
                    look at it.
                  </Text>
                  <Image
                    source={require("../../../assets/images/submit1.jpeg")}
                    style={styles.imageSubmit}
                  />
                </>
              ) : applicationStatus == "rejected" ? (
                <>
                  <Text style={styles.statusText}>
                    We're sorry, your application was rejected.
                  </Text>
                  <Image
                    source={require("../../../assets/images/rejected.jpeg")}
                    style={styles.image}
                  />
                </>
              ) : (
                <>
                  {buttonStatus == "initial" ? (
                    <>
                      <Text style={styles.statusText}>
                        Before starting to sell, you need to submit an
                        application to become a verified seller
                      </Text>
                      <Image
                        source={require("../../../assets/images/getverified.jpeg")}
                        style={styles.image}
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.credsFont}>
                        What’s your professional status?
                      </Text>
                      <View style={{ zIndex: 100 }}>
                        <DropDownPicker
                          open={open}
                          value={value}
                          items={items}
                          setOpen={setOpen}
                          setValue={setValue}
                          setItems={setItems}
                          style={styles.dropDownContainer}
                          dropDownContainerStyle={styles.dropDownContainerList}
                          onChangeValue={(val) => {
                            if (val != "other") {
                              setOtherValue("");
                            }
                          }}
                        />
                      </View>
                      {value == "other" && (
                        <>
                          <Text style={styles.credsFont}>
                            Please specify your status
                          </Text>
                          <Input
                            onChangeText={(text: string) => setOtherValue(text)}
                            value={otherValue}
                            style={{
                              ...styles.inputField,
                              marginBottom: hp(1),
                            }}
                            inputViewStyle={styles.inputViewStyle}
                            iconColor={"#ccc"}
                            autoCapitalize={"none"}
                            placeholder={"Other"}
                          />
                        </>
                      )}
                      <Text style={styles.credsFont}>Phone number</Text>
                      {/* <Input
                        onChangeText={(text: string) => setPhone(text)}
                        value={phone}
                        style={styles.inputField}
                        inputViewStyle={styles.inputViewStyle}
                        iconColor={"#ccc"}
                        autoCapitalize={"none"}
                        placeholder={"Phone"}
                        keyboardType={"number-pad"}
                      /> */}
                      <TouchableOpacity
                        style={styles.inputViewStyle}
                        onPress={() => setShow(true)}
                      >
                        {countryCode ? (
                          <Text style={{ width: "20%", marginLeft: 10 }}>
                            {countryFlag + " " + countryCode}
                          </Text>
                        ) : (
                          <Text style={{ width: "15%", marginLeft: 10 }}>
                            🏳️ +0
                          </Text>
                        )}
                        <Input
                          onChangeText={(text: string) => setPhone(text)}
                          value={phone}
                          style={{
                            ...styles.inputField,

                            width: countryCode ? "95%" : "90%",
                          }}
                          icon
                          iconColor={tintColorDark}
                          iconName="phone"
                          inputViewStyle={{
                            ...styles.inputViewStyle,

                            // marginTop: 10,
                            width: countryCode ? "70%" : "80%",
                          }}
                          autoCapitalize={"none"}
                          placeholder={"Phone number"}
                          keyboardType="number-pad"
                          // onPressIn={() => setShow(true)}
                        />
                      </TouchableOpacity>
                      <MyButton
                        style={{ ...styles.button, marginTop: hp(2) }}
                        onPress={() => {
                          if (value && phone) {
                            Inquiry.fromTemplate(
                              "itmpl_8Bv8HzfgETE6aXgeFnAZ5Z4E"
                            )
                              .environment(Environment.PRODUCTION)
                              .onComplete((inquiryId, status, fields) =>
                                submitApplicationApi(inquiryId, status)
                              )
                              .onError((error) =>
                                Alert.alert("Error", error.message)
                              )
                              .build()
                              .start();
                          } else {
                            Toast.show(
                              "Please select status and phone number",
                              {
                                duration: Toast.durations.LONG,
                                position: Toast.positions.BOTTOM,
                              }
                            );
                          }
                        }}
                      >
                        <Text style={styles.buttonText}>
                          Start Indentity Verification
                        </Text>
                      </MyButton>
                    </>
                  )}
                </>
              )}
            </>
          </View>
        )}
        <CountryPicker
          show={show}
          style={{
            modal: {
              height: 500,
            },
          }}
          onBackdropPress={() => setShow(false)}
          onRequestClose={() => setShow(false)}
          pickerButtonOnPress={(item) => {
            setCountryCode(item.dial_code);
            setCountryFlag(item.flag);
            setShow(false);
          }}
        />
      </View>
      {/* {buttonStatus == "initial" && ( */}
      <View style={styles.buttonContainer}>
        <MyButton
          style={styles.button}
          onPress={() => {
            setButtonStatus("started");
            if (
              applicationStatus == "rejected" ||
              applicationStatus == "pending" ||
              buttonStatus == "started"
            ) {
              logoutApi();
            }
          }}
          isLoading={logoutUserResp?.isLoading}
          disabled={logoutUserResp?.isLoading}
          loaderColor={styles.loaderColor}
        >
          <Text style={styles.buttonText}>
            {applicationStatus == "required" && buttonStatus == "initial"
              ? "Lets start"
              : "Logout"}
          </Text>
        </MyButton>
      </View>
      {/* )} */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  credsFont: {
    fontWeight: "700",
    fontSize: hp(2),
    color: "black",
    marginBottom: hp(1),
  },
  innerContainer: {
    marginHorizontal: hp(2.5),
    marginTop: hp(2),
  },
  inputField: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 10,
    // marginVertical: 6,
    height: hp(6),

    width: "100%",
    color: "black",
    // marginBottom: hp(2),
  },
  inputViewStyle: {
    flexDirection: "row",
    width: "100%",

    height: hp(6),
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    // marginBottom: hp(2),
  },

  dropDownContainerList: {
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#cccccc60",
  },
  dropDownContainer: {
    borderWidth: 2,
    marginBottom: hp(1),
    borderColor: "#cccccc60",
  },
  button: {
    backgroundColor: tintColorDark,
    borderRadius: hp(5),
    height: hp(7),
    width: "100%",
    justifyContent: "center",
    alignItems: "center",

    marginBottom: hp(3),
  },
  buttonText: {
    color: "white",
    fontSize: hp(2),
    fontWeight: "700",
  },
  buttonContainer: {
    alignItems: "center",
    // bottom: 0,
    backgroundColor: "white",
    paddingHorizontal: hp(2.5),
  },
  loaderColor: {
    color: "white",
  },
  indicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: hp(20),
    width: wp(70),
    alignSelf: "center",
    borderRadius: 10,
    marginTop: hp(10),
  },
  imageSubmit: {
    height: hp(30),
    width: wp(70),
    alignSelf: "center",
    borderRadius: 10,
    marginTop: hp(10),
  },
  statusText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});