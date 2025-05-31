import HelpRequestForm from "../components/form/helpRequestForm/HelpRequestForm";
import LoginIllustration from '@assets/login_illustration.png'


export default function HelpRequestPage() {
  return (
    <div className="min-h-screen flex flex-row items-center  justify-center">

      {/* Illustration à gauche */}
      <div className="justify-center items-center">
        <div className="max-w-sm">
          <img
            src={LoginIllustration}
            alt="Illustration de l'inscription à Solidarix"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="">
        <HelpRequestForm />
      </div>

    </div>
  );
}