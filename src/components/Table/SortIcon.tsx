import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { ExpenseProperty, SORT } from "../../types/ExpenseTypes";
import { useCallback, useMemo } from "react";
import { useExpenseStore } from "../../ExpenseStoreContext";

interface Props {
  propertyName: ExpenseProperty;
}

const SortIcon = ({ propertyName }: Props) => {
  const { sortedBy, sortExpenses, sortedProperty } = useExpenseStore();
  const dataTestId = useMemo(() => {
    return "sort" + propertyName;
  }, [propertyName]);

  const renderAscIcon = useCallback(() => {
    return (
      <FaSortUp
        data-testid={dataTestId}
        onClick={() => {
          sortExpenses(propertyName, SORT.DESC);
        }}
      />
    );
  }, [dataTestId, propertyName, sortExpenses]);

  const renderDescIcon = useCallback(() => {
    return (
      <FaSortDown
        data-testid={dataTestId}
        onClick={() => {
          sortExpenses(propertyName, SORT.DEFAULT);
        }}
      />
    );
  }, [dataTestId, propertyName, sortExpenses]);

  const renderDefaultIcon = useCallback(() => {
    return (
      <FaSort
        data-testid={dataTestId}
        onClick={() => {
          sortExpenses(propertyName, SORT.ASC);
        }}
      />
    );
  }, [dataTestId, propertyName, sortExpenses]);

  const icon = useMemo(() => {
    if (sortedProperty === propertyName && sortedBy !== SORT.DEFAULT) {
      if (sortedBy === SORT.ASC) {
        return renderAscIcon();
      }
      if (sortedBy === SORT.DESC) {
        return renderDescIcon();
      }
    }
    return renderDefaultIcon();
  }, [renderAscIcon, renderDefaultIcon, renderDescIcon, sortedBy, sortedProperty]);

  return <>{icon}</>;
};

export default SortIcon;
