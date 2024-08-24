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
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
