import Image from "next/image";

const VerificationSuccess = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center max-w-md">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
          <Image
            src="/account-confirmation-success.svg"
            alt="success-image"
            width={480}
            height={480}
            className="w-full h-auto"
          />
        </div>

        <h1 className="text-2xl font-semibold mt-6">
          Account verification Success
        </h1>
        <p className="text-base mt-2">Welcome to our team!</p>
        <p className="text-sm mt-1 text-gray-600 font-light">
          you can close this page
        </p>
      </div>
    </div>
  );
};

export default VerificationSuccess;
