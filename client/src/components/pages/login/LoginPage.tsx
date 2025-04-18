import AppForm from "~/components/common/form/AppForm";
import PageTitle from "../../layout/page/page-title/PageTitle";
import FormRow from "~/components/common/form/form-row/FormRow";
import { useState } from "react";
import { authPostJson } from "~/utilities/authFetches";
import { getApiUrl, throwIfResponseError } from "~/utilities/apiUtilities";
import settings from "~/settings/settings";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <PageTitle
        title="Login"
      />

      <AppForm>
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
                };

                localStorage.setItem(settings.localStorageTokenName, loginResult.token);

                // TODO: save loginResult into a context somehow to remember who the current user is.
              } catch (err) {
                // TODO: handle error message.
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