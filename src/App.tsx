import { useAppDispatch, useAppSelector } from './store/hooks';
import { increment, decrement, incrementByAmount, reset } from './store/slices/counterSlice';

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            NPPD Gym Admin
          </h1>
          <p className="text-gray-600">
            React + TypeScript + Redux Toolkit + Tailwind CSS
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-8 mb-6 text-center">
          <p className="text-white text-sm font-medium mb-2">Counter Value</p>
          <p className="text-6xl font-bold text-white">{count}</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(increment())}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Increment
            </button>
            <button
              onClick={() => dispatch(decrement())}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Decrement
            </button>
          </div>

          <button
            onClick={() => dispatch(incrementByAmount(5))}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Add 5
          </button>

          <button
            onClick={() => dispatch(reset())}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
          >
            Reset
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Edit <code className="bg-gray-100 px-2 py-1 rounded text-xs">src/App.tsx</code> to customize
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
