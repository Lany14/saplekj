import VerifyTokenForm from "@/components/FrontEnd/Site/Forms/VerifyTokenForm";
import { getUserById } from "../../../../../../actions/user";

export default async function VerifyAccount({
  params: { id },
}: {
  params: { id: string };
}) {
  //Get a User
  const user = await getUserById(id);
  const userToken = user?.token ?? undefined;
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
        <div className="w-full rounded-lg bg-white shadow-2xl dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Verify Account
            </h1>
            <p>
              <span className="font-medium">Please Check your Email!</span> We
              have sent you a verification code. Please enter the code here to
              verify your Account. Thank you!
            </p>

            <VerifyTokenForm userToken={userToken} id={id} />
          </div>
        </div>
      </div>
    </section>
  );
}
