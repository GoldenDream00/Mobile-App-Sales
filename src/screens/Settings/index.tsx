import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import Icon from "@expo/vector-icons/Entypo";
import Icons from "@expo/vector-icons/SimpleLineIcons";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header";
import { Text, View } from "../../../components/Themed";
import { useLogoutUserMutation } from "../../../redux/auth/authApiSlice";
import { logOut } from "../../../redux/auth/authSlice";
import { hp, wp } from "../../../utils";

export default function Settings(props: any) {
  const dispatch = useDispatch();
  const refreshToken = useSelector((state) => state?.auth?.refreshToken?.token);
  const user = useSelector((state) => state?.auth?.loginUser);

  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const logoutApi = async () => {
    const data = {
      refreshToken,
    };
    try {
      const resp = await logoutUser(data);

      dispatch(logOut());
    } catch (error) {
      console.log("---error--logout-", error);
    }
  };
  return (
    <View style={styles.container}>
      <Header title={"Settings"} />

      <ScrollView style={styles.innerContainer}>
        <Text style={styles.textTitle}>Profile</Text>

        <View style={styles.mainContainer}>
          <View style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icon name="user" size={20} />
              </View>
              <Text style={styles.titleText}>Name</Text>
            </View>
            <Text style={styles.titleText}>{user?.username}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icon name="email" size={20} />
              </View>
              <Text style={styles.titleText}>Email</Text>
            </View>
            <Text style={styles.titleText}>{user?.email}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icon name="flag" size={20} />
              </View>
              <Text style={styles.titleText}>Role</Text>
            </View>
            <Text style={styles.titleText}>{user?.role}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icon name="calendar" size={20} />
              </View>
              <Text style={styles.titleText}>Created</Text>
            </View>
            <Text style={styles.titleText}>
              {moment(user?.createdAt).format("MMMM Do YYYY")}
            </Text>
          </View>
        </View>
        <Text style={styles.textTitle}>Settings</Text>

        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icon name="wallet" size={20} />
              </View>
              <Text style={styles.titleText}>Payouts</Text>
            </View>
            <View style={styles.iconsView}>
              <Icons name="arrow-right" size={15} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icons name="bell" size={20} />
              </View>
              <Text style={styles.titleText}>Notifications</Text>
            </View>
            <View style={styles.iconsView}>
              <Icons name="arrow-right" size={15} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.backgroundView}>
            <View style={styles.rowView}>
              <View style={styles.iconView}>
                <Icons name="info" size={20} />
              </View>
              <Text style={styles.titleText}>Miscellaneous</Text>
            </View>
            <View style={styles.iconsView}>
              <Icons name="arrow-right" size={15} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => logoutApi()} style={styles.logoutView}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* <Text style={styles.title}>SETTINGS</Text>
      <Text>
        Connected as: {user?.username} [{user?.email}]
      </Text>
      <Button title="Logout" onPress={() => logoutApi()} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  textTitle: {
    marginTop: hp(2),
    marginBottom: hp(1),
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  innerContainer: {
    width: wp(90),
    height: 100,
    alignSelf: "center",
    marginVertical: hp(1),
  },
  iconsView: {
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  backgroundView: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9F9F9",
  },

  mainContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    padding: hp(2),
    width: wp(90),
  },
  logoutView: {
    backgroundColor: "#F9F9F9",
    borderRadius: 20,
    padding: hp(2),
    width: wp(90),
    marginTop: hp(2),
    alignItems: "center",
  },
  logoutText: {
    color: "#DF1E1E",
    fontSize: 18,
    fontWeight: "600",
  },

  iconView: {
    width: wp(10),
    backgroundColor: "#F9F9F9",
  },
  divider: {
    height: wp(0.2),
    width: "100%",
    backgroundColor: "#DEDEDE",
    marginVertical: hp(2),
  },
  rowView: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
  },
});
