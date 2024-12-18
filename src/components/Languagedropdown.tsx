// @ts-nocheck
import  { useState } from 'react';

type Option = {
  value: string;
  text: string;
  selected: boolean;
};

type LanguageDropdownProps = {
  formData: { languages_known: string[] };
  setFormData: React.Dispatch<React.SetStateAction<{ languages_known: string[] }>>;
};

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({ formData, setFormData }) => {
  const [options, setOptions] = useState<Option[]>([
    { value: 'Hindi', text: 'Hindi', selected: false },
    { value: 'English', text: 'English', selected: false },
    { value: 'Bengali', text: 'Bengali', selected: false },
    { value: 'Telugu', text: 'Telugu', selected: false },
    { value: 'Marathi', text: 'Marathi', selected: false },
    { value: 'Tamil', text: 'Tamil', selected: false },
    { value: 'Urdu', text: 'Urdu', selected: false },
    { value: 'Gujarati', text: 'Gujarati', selected: false },
    { value: 'Malayalam', text: 'Malayalam', selected: false },
    { value: 'Kannada', text: 'Kannada', selected: false },
    { value: 'Odia', text: 'Odia', selected: false },
    { value: 'Punjabi', text: 'Punjabi', selected: false },
    { value: 'Assamese', text: 'Assamese', selected: false },
    { value: 'Maithili', text: 'Maithili', selected: false },
    { value: 'Sanskrit', text: 'Sanskrit', selected: false },
    { value: 'Konkani', text: 'Konkani', selected: false },
    { value: 'Sindhi', text: 'Sindhi', selected: false },
    { value: 'Dogri', text: 'Dogri', selected: false },
    { value: 'Manipuri', text: 'Manipuri', selected: false },
    { value: 'Bodo', text: 'Bodo', selected: false },
    { value: 'Santhali', text: 'Santhali', selected: false },
    { value: 'Kashmiri', text: 'Kashmiri', selected: false },
    { value: 'Nepali', text: 'Nepali', selected: false },
    { value: 'Rajasthani', text: 'Rajasthani', selected: false },
    { value: 'Bhili/Bhilodi', text: 'Bhili/Bhilodi', selected: false },
    { value: 'Sora', text: 'Sora', selected: false },
    { value: 'Tulu', text: 'Tulu', selected: false },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (index: number) => {
    const updatedOptions = [...options];
    const option = updatedOptions[index];
    option.selected = !option.selected;
    setOptions(updatedOptions);

    if (option.selected) {
      setFormData(prevData => ({
        ...prevData,
        languages_known: [...prevData.languages_known, option.value]
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        languages_known: prevData.languages_known.filter(lang => lang !== option.value)
      }));
    }
  };

  const handleDropdownToggle = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col space-y-2 w-full">
      <form>
        <input name="values" type="hidden"  className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md" value={formData.languages_known.join(', ')} />
        <div className="inline-block relative w-64">
          <div className="flex flex-col items-center relative">
            <div
              onClick={handleDropdownToggle}
              className="p-4 text-lg w-full h-16 border border-gray-300 rounded-md"
            >
              <div className="flex flex-auto flex-wrap">
                {formData.languages_known.map((language, index) => (
                  <div
                    key={language}
                    className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-black-700 bg-black-100 border border-black-300"
                  >
                    <div className="text-xs font-normal leading-none max-w-full flex-initial">
                      {language}
                    </div>
                    <div
                      className="flex flex-auto flex-row-reverse"
                      onClick={() => handleSelect(options.findIndex(opt => opt.value === language))}
                    >
                      <svg
                        className="fill-current h-6 w-6"
                        role="button"
                        viewBox="0 0 20 20"
                      >
                        <path d="M14.348,14.849c-0.469,0.469-1.229,0.469-1.697,0L10,11.819l-2.651,3.029c-0.469,0.469-1.229,0.469-1.697,0c-0.469-0.469-0.469-1.229,0-1.697l2.758-3.15L5.651,6.849c-0.469-0.469-0.469-1.228,0-1.697s1.228-0.469,1.697,0L10,8.183l2.651-3.031c0.469-0.469,1.228-0.469,1.697,0s0.469,1.229,0,1.697l-2.758,3.152l2.758,3.15C14.817,13.62,14.817,14.38,14.348,14.849z" />
                      </svg>
                    </div>
                  </div>
                ))}
                {formData.languages_known.length === 0 && (
                  <input
                    placeholder="Select a language"
                    className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                    value={formData.languages_known.join(', ')}
                    readOnly
                  />
                )}
              </div>
            </div>

            <div className="text-gray-300 w-full w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
              <button
                type="button"
                onClick={handleDropdownToggle}
                className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
              >
                <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                  <path d="M17.418,6.109c0.272-0.268,0.709-0.268,0.979,0s0.271,0.701,0,0.969l-7.908,7.83c-0.27,0.268-0.707,0.268-0.979,0l-7.908-7.83c-0.27-0.268-0.27-0.701,0-0.969c0.271-0.268,0.709-0.268,0.979,0L10,13.25L17.418,6.109z" />
                </svg>
              </button>
            </div>
          </div>

          {isOpen && (
  <div className="absolute shadow top-100 bg-white z-40 w-full left-0 rounded max-h-60 overflow-y-auto">
    <div className="flex flex-col w-full">
      {options.map((option, index) => (
        <div
          key={option.value}
          className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-black-100"
          onClick={() => handleSelect(index)}
        >
          <div
            className={`flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative ${
              option.selected ? 'border-black-600' : ''
            }`}
          >
            <div className="w-full items-center flex">
              <div className="mx-2 leading-6">{option.text}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

        </div>
      </form>
    </div>
  );
};

export default LanguageDropdown;
