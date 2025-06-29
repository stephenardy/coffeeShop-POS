export default function Home() {
  return (
    <div>
      <h1>this is Main Page of POS APP</h1>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
}
