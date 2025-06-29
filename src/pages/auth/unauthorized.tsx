import Image from "next/image";

const UnauthorizedPage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center max-w-md">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
          <Image
            src="/unauthorized.svg"
            alt="success-image"
            width={480}
            height={480}
            className="w-full h-auto"
          />
        </div>

        <h1 className="text-2xl font-semibold mt-6">Unauthorized</h1>
        <p className="text-base mt-2">
          You don{"'"}t have permission to access this page
        </p>
        <p className="text-sm mt-1 text-gray-600 font-light">
          try again or contact IT Support
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
