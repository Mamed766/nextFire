export default function ViewModal({
  todo,
  onClose,
}: {
  todo: any;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          Product Name: {todo?.productName}
        </h2>
        <p className="text-gray-700 mb-2">User ID: {todo?.userId}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white p-2 rounded mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}
