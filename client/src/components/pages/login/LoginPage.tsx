import AppForm from "~/components/common/form/AppForm";
import PageTitle from "../../layout/page/page-title/PageTitle";
import FormRow from "~/components/common/form/form-row/FormRow";
import { useState } from "react";
import { authPostJson } from "~/utilities/authFetches";
import { getApiUrl, throwIfResponseError } from "~/utilities/apiUtilities";
import settings from "~/settings/settings";
import { useUser } from "~/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import AppRoutes from "~/routing/AppRoutes";
import styles from "./LoginPage.module.scss";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userCtx = useUser();
  const nav = useNavigate();

  return (
    <>
      <AppForm className={styles.loginForm}>
        <PageTitle
          title="Login"
        />

        <FormRow
          label="Email"
        >
          <input type="text" value={email} onChange={e => setEmail(e.currentTarget.value)} />
        </FormRow>

        <FormRow
          label="Password"
        >
          <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} />
        </FormRow>

        <FormRow label="">
          <button
            onClick={async () => {
              try {
                // Do Login.
                const response = await authPostJson({
                  url: getApiUrl("/me/login"),
                  data: {
                    email,
                    password,
                  },
                });

                await throwIfResponseError(response);

                const json = await response.json();

                const loginResult = {
                  email: json.email,
                  token: json.token,
                  username: json.username || "",
                };

                userCtx.setUser({
                  email: loginResult.email,
                  username: json.username || "",
                  token: json.token,
                });

                nav(AppRoutes.Dashboard);
              } catch (err) {
                // TODO: handle error message.
                alert("Failed to login: " + (err instanceof Error ? err.message : "Unknown error"));
              }
            }}
          >
            Login
          </button>
        </FormRow>
      </AppForm>
    </>
  );
}