interface WrapperProps {
  title: string,
  children: React.ReactNode
}

const Wrapper: React.FC<WrapperProps> = ({title, children}) => {
  return (
    <div className="">
      <h1 className="text-2xl">
        <b>{title}</b>
      </h1>
      {children}
    </div>
  );
}

export default Wrapper

