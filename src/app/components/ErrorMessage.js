import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">
            Something went wrong
          </h3>
          <p className="text-sm text-red-700 mt-1">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}