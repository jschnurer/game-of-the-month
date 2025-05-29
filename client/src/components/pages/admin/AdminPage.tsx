import { useState } from "react";
import { getApiUrl, throwIfResponseError } from "../../../utilities/apiUtilities";
import { authPostJson } from "../../../utilities/authFetches";
import AppForm from "../../common/form/AppForm";
import FormRow from "../../common/form/form-row/FormRow";
import PageTitle from "../../layout/page/page-title/PageTitle";

export default function AdminPage() {
  const [state, setState] = useState<{
    email: string,
    name: string,
    password: string,
    isAdmin: boolean,
  }>({
    email: "",
    name: "",
    password: "",
    isAdmin: false,
  });

  const onSubmit = async () => {
    try {
      const response = await authPostJson({
        url: getApiUrl("/admin/users"),
        data: {
          email: state.email,
          name: state.name,
          passwordPlain: state.password,
          isAdmin: state.isAdmin,
        },
      });

      await throwIfResponseError(response);

      alert("User created.");
    } catch (err) {
      alert(`Error: ${err?.toString()}`);
    }
  };

  return (
    <>
      <PageTitle
        title="User Admin"
      />

      <AppForm>
        <FormRow
          label="Email"
        >
          <input type="text" value={state.email} onChange={e => setState({ ...state, email: e.currentTarget.value })} />
        </FormRow>

        <FormRow
          label="Name"
        >
          <input type="text" value={state.name} onChange={e => setState({ ...state, name: e.currentTarget.value })} />
        </FormRow>

        <FormRow
          label="Password"
        >
          <input type="password" value={state.password} onChange={e => setState({ ...state, password: e.currentTarget.value })} />
        </FormRow>

        <FormRow
          label="Is Admin"
        >
          <input type="checkbox" checked={state.isAdmin} onChange={e => setState({ ...state, isAdmin: e.currentTarget.checked })} />
        </FormRow>

        <FormRow label="">
          <button
            onClick={onSubmit}
          >
            Create User
          </button>
        </FormRow>

      </AppForm>
    </>
  );
}