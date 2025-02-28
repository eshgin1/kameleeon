import { MouseEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Site, Status, Test } from "@/types/global";

interface TableProps {
  data: Test[];
  siteData: Site[];
  setInputValue: (text: string) => void
  onSortForStatus: () => void;
  onSortForColumn: (col: string) => void
  isSorted: boolean;
  sortStates: {
    [key: string]: boolean
  }
}

const Table:React.FC<TableProps> = ({
  data, 
  siteData, 
  onSortForStatus,
  onSortForColumn, 
  setInputValue,
  isSorted,
  sortStates
}) => {
  const router = useRouter()
  
  const handleRowClick = (e: MouseEvent, item: Test) => {
    e.preventDefault()
    const text = item.status === Status.DRAFT ? 'Finalize' : 'Results';
    router.push(`/${text.toLowerCase()}/${item.id}`)
  };

  const headerCols = useMemo(() => {
    if(data.length) {
      return Object.keys(data[0])
      .map(key => {
        if(key === "siteId") {
          return "site"
        }
        return key
      })
      .filter(key => key !== "id");
    }
  }, [data])
  
  const headerTable = headerCols?.map((item, index) => {
    if(item.toUpperCase() === 'STATUS') {
      return (
        <th className="w-[300px] text-start text-[#999999]" key={index}>
          <span>{item.toUpperCase()}</span>
          <button 
            onClick={onSortForStatus}
            className="bg-[#2EE5AC] 
            rounded-[10px]
            text-white 
            cursor-pointer
            ml-2">
            {isSorted ? 'done' : 'sort'}
          </button>
        </th>
      )
    }
    return (
      <th 
        className="w-[300px] text-start text-[#999999]" 
        key={index}
      >
        <span>{item.toUpperCase()}</span>
        <button 
          onClick={() => onSortForColumn(item)}
          className="bg-[#2EE5AC] 
          rounded-[10px]
          text-white 
          cursor-pointer
          ml-2">
          {sortStates[item.toLowerCase()] ? 'done' : 'sort'}
        </button>
      </th>
    )
  })
  
  const bodyTable = data.map((item, index) => {
    const site = siteData.find((site: Site) => site.id === item.siteId);
    let address = site?.url ;
    
    if (address) {
      address = address.replace('https://www.', '').replace('http://', '').replace('https://', '');
    }
    
    return (
      <tr 
        onClick={(e) => handleRowClick(e, item)}
        
        key={index} 
        className={
          `${site && site.id === 1 ? 'border-l-[#E14165]' :
          site && site.id === 2 ? 'border-l-[#C2C2FF]' :
          site && site.id === 3 ? 'border-l-[#8686FF]' :
          ''}
          h-[70px] 
          border-l-4 
          border-1
          border-solid
          rounded-lg
          hover:cursor-pointer
          hover:shadow-md`
        }
      >
        <td>{item.name.toLowerCase()}</td>
        <td>{item.type.toLowerCase()}</td>
        <td className={
          item.status === Status.ONLINE ? 'text-[#1BDA9D]' : 
          item.status === Status.DRAFT ? 'text-[#5C5C5C]' : 
          'text-[#FE4848]'
          }
          >
          {item.status.toLowerCase()}
        </td>
        <td className="flex justify-between items-end ">
          <a href={`https://${item.site}`} target="_blank" rel="noopener noreferrer">
            {address}
          </a>
          <button className={
            `${item.status === Status.DRAFT ? 'bg-[#7D7D7D]' : 'bg-[#2EE5AC]'} 
            rounded-[10px]
            text-white 
            cursor-pointer
            ml-2 py-2 px-4`}
          >
            {
              item.status === Status.DRAFT ? 'Finalize' : 'Results'
            }
          </button>
        </td>
      </tr>
    )
  })

  // empty layout
  if(data.length === 0) {
    return <div className="flex flex-col items-center">
      <h2 className="mt-[20px]">Your search did not match any results.</h2>
      <button
      onClick={() => setInputValue('')}
      className={
        `w-[300px]
        bg-[#2EE5AC] 
        rounded-[10px]
        text-white 
        cursor-pointer
        py-2 px-4`}
      >Reset</button>
    </div>
  }
  
  return (
    <div className="py-10">
      <table>
        <thead>
          <tr>
            {headerTable}
          </tr>
        </thead>
        <tbody>
          {bodyTable}
        </tbody>
      </table>
    </div>
  );
}

export default Table