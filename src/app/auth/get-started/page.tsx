import { GoogleMapsProvider } from "@/src/components/loaderGoogle";
import QuestionnaireForm from "@/src/components/questionnaire/_components/questionnaire-form";

export default function QuestionnairePage() {
  return (
    <div>
      <div className="text-center flex-1">
        <GoogleMapsProvider>
          <QuestionnaireForm  />
        </GoogleMapsProvider>
      </div>
    </div>
  );
}
