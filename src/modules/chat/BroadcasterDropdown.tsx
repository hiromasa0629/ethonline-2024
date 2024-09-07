import { BROADCASTER } from "./utils";

const BroadcasterDropdown = ({
  selectedBroadcaster,
  handleSelectChange,
  isOnNetwork,
}: {
  selectedBroadcaster: any;
  handleSelectChange: any;
  isOnNetwork: boolean;
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <label className="text-sm font-medium text-gray-700">Select Broadcaster</label>
      <select
        value={selectedBroadcaster}
        onChange={handleSelectChange}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
      >
        <option value="" disabled>
          Select a broadcaster
        </option>
        {Object.keys(BROADCASTER).map((key) => (
          <option key={key} value={BROADCASTER[key]}>
            {key}
          </option>
        ))}
      </select>
      {selectedBroadcaster && (
        <div className="text-sm text-gray-600 mt-2">
          <p>Selected Broadcaster Address: {selectedBroadcaster || "N/A"}</p>
          <p>Available: {`${isOnNetwork}`.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
};

export default BroadcasterDropdown;
