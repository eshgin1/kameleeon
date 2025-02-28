
'use client';
import Table from "@/components/Table";
import Wrapper from "@/components/Wrapper";
import Input from "@/components/ui/Input";
import { getDataSite, getDataTable } from "@/redux/requests/requests";
import { Site, Status, Test } from "@/types/global";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Dashboard() {
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [siteData, setSiteData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSorted, setIsSorted] = useState(false);
  const [sortStates, setSortStates] = useState({
    name: false,
    type: false,
    site: false,
  });

  useEffect(() => {
    getDataTable()
    .then(res => {
      setTableData(res);
      setOriginalData(res);
    });

    getDataSite()
    .then(res => {
      setSiteData(res);
    });
  }, []);

  const filterTableData = useMemo(() => {
    return tableData?.filter((item: Test) => {
      return item.name.toLowerCase().includes(inputValue.toLowerCase());
    });
  }, [inputValue, tableData]); 

  const onSortForStatus = useCallback(() => {
    if (filterTableData.length) {
      const statusOrder = [Status.ONLINE, Status.PAUSED, Status.STOPPED, Status.DRAFT]; // можно избежать прописывания в ручную
      
      if (!isSorted) {
        const sortedData = filterTableData
          .slice() 
          .sort((a: { status: Status }, b: { status: Status }) => {
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
          });
        setTableData(sortedData);
      } else {
        // getDataTable(); // можно вызывать что получить оригинальные данные(например на случай если данные изменились )
        setTableData(originalData); // можно и так , работает быстрее 
      };

      setIsSorted(!isSorted);
    }
  }, [filterTableData, isSorted, originalData]);

  const onSortForColumn = useCallback((col: string) => {
    if (filterTableData.length) {
      let sortedData;
  
      // по дефолту
      const newSortStates = {
        name: false,
        type: false,
        site: false,
      };
  
      if (col.toLowerCase() === 'name') {
        sortedData = sortStates.name 
          ? originalData 
          : filterTableData.slice().sort((a: { name: string }, b: { name: string }) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
        newSortStates.name = !sortStates.name;
      } else if (col.toLowerCase() === 'type') {
        sortedData = sortStates.type 
          ? originalData 
          : filterTableData.slice().sort((a: { type: string }, b: { type: string }) => a.type.toLowerCase() > b.type.toLowerCase() ? 1 : -1);
        newSortStates.type = !sortStates.type;
      } else if (col === 'site') {
        const updatedItems = filterTableData
        .filter((item: Test) => siteData.some((site: Site) => site.id === item.siteId))
        .toSorted((a: { siteId: number }, b: { siteId: number }) => {
          const siteA = siteData.find((site: Site) => site.id === a.siteId) as any;
          const siteB = siteData.find((site: Site) => site.id === b.siteId) as any;
    
          return siteA.url.replace('https://www.', '').replace('http://', '').replace('http://', '').replace('https://', '').toLowerCase() > siteB.url.replace('https://www.', '').replace('http://', '').replace('http://', '').replace('https://', '').toLowerCase() ? 1 : -1;
        });
        
        sortedData = sortStates.site 
          ? originalData 
          : updatedItems.slice().sort((a: {siteId: number}, b: {siteId: number}) => a.siteId > b.siteId ? 1 : -1) as any;
        newSortStates.site = !sortStates.site;
      }
  
      setTableData(sortedData.reverse()); // разворачиваем так как id сортируется в обратном порядке
      setSortStates(newSortStates);
    }
  }, [filterTableData, originalData, siteData, sortStates]);
  
  return (
    <Wrapper title="Dashboard">
      <div className="mt-4">
        <Input setInputValue={setInputValue} inputValue={inputValue}/>
        <Table 
          isSorted={isSorted}
          sortStates={sortStates}
          data={filterTableData} 
          siteData={siteData}
          setInputValue={setInputValue}
          onSortForStatus={onSortForStatus}
          onSortForColumn={onSortForColumn}
        />
      </div>
    </Wrapper>
  );
}
