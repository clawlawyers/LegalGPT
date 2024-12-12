import { useSelector } from "react-redux";

export const useAuthState = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  return {
    isAuthLoading:
      authStatus === "loading" || authStatus === "idle" ? true : false,
    isAuthError: authError === null ? false : true,
  };
};

export const activePlanFeatures = (planArr, feature) => {
  let activePlanFilter;
  if (!feature) {
    activePlanFilter = planArr
      .filter((x) => x.isActive === true)
      .filter((x) => x.planName !== "ADDON_M");
  } else {
    activePlanFilter = planArr
      .filter((x) => x.isActive === true)
      .filter((x) => x.plan[`${feature}`]);
  }

  // console.log(activePlanFilter);
  return activePlanFilter;
};
