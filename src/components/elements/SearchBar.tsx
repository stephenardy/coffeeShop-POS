import { Dispatch } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface PropsTypes {
  query: string;
  setQuery: Dispatch<React.SetStateAction<string>>;
  setCurrentPage: Dispatch<React.SetStateAction<number>>;
}

const SearchBar = ({ query, setQuery, setCurrentPage }: PropsTypes) => {
  return (
    <div className="flex flex-row items-center gap-3 p-4 rounded-lg">
      <Label className="text-sm text-foreground whitespace-nowrap">
        Search Menus:
      </Label>
      <Input
        type="text"
        placeholder="find menu"
        className="w-full text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-md px-3 py-2"
        value={query}
        onChange={(e) => {
          setCurrentPage(1);
          setQuery(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchBar;
