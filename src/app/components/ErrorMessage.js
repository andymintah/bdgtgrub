export default function ErrorMessage({ message }) {
  return (
    <div role="alert" className="bg-plate border-l-4 border-reduced rounded-r-xl p-5 mb-8">
      <h2 className="font-bold text-reduced">Couldn&apos;t load meals</h2>
      <p className="mt-1">{message}</p>
      <p className="mt-1 text-steam text-sm">Check your details and search again.</p>
    </div>
  );
}
