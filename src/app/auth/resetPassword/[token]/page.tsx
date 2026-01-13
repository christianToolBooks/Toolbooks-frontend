import ResetPassword from "../../_components/resetPasswordForm";

interface FormResetPaswordPageProps {
  params: Promise<{ token: string }>;
}

export default async function FormResetPassword({params}: FormResetPaswordPageProps) {
      const { token } = await params; 
    return (
        <ResetPassword token = {token}/>
    )
}
