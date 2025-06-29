import Image from "next/image";

const NoRolePage = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center max-w-md">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
          <Image
            src="/no-role.svg"
            alt="success-image"
            width={480}
            height={480}
            className="w-full h-auto"
          />
        </div>

        <p className="text-base mt-2">You don{"'"}t have a role yet.</p>
        <p className="text-sm mt-1 text-gray-600 font-light">
          Please contact your manager for role assignment
        </p>
      </div>
    </div>
  );
};

export default NoRolePage;
