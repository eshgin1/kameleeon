interface InputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const Input: React.FC<InputProps> = ({inputValue, setInputValue}) => {
  return <input 
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
  className="border-1 p-2 w-full"
  type="text" 
  placeholder="What test are you looking for?"
  />;
};

export default Input