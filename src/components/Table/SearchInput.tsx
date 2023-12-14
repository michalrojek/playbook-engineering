import { css } from "@emotion/react";

export const SEARCH = "search";

const searchInput = css({
  marginTop: 10,
  marginBottom: 5,
  height: 30,
});

interface Props {
  handleSearch: (searchText: string) => void;
  searchText: string;
}

const SearchInput = ({ handleSearch, searchText }: Props) => {
  return (
    <input
      css={searchInput}
      data-testid={SEARCH}
      id={SEARCH}
      name={SEARCH}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder={SEARCH}
      type="text"
      value={searchText}
    />
  );
};

export default SearchInput;
