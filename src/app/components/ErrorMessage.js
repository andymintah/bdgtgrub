export default function ErrorMessage({ message }) {
  return (
    <div role="alert" className="bg-box rounded-3xl p-6 mb-8 border-4 border-ketchup">
      <h2 className="font-display text-2xl text-ketchup">Couldn&apos;t load meals</h2>
      <p className="mt-2 font-semibold">{message}</p>
      <p className="mt-1">Check your details and search again.</p>
    </div>
  );
}
