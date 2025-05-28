// components/DatePicker.tsx (or wherever it is)
type DatePickerProps = {
  onDateChange: (date: Date) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ onDateChange }) => {
  return (
    <input
      type="date"
      onChange={(e) => onDateChange(new Date(e.target.value))}
      className="p-2 border rounded"
    />
  );
};

export default DatePicker;
