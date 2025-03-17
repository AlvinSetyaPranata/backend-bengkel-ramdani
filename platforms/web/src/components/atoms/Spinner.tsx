export default function Spinner({ state} : {state: boolean}) {
  return (
    <div className={`flex items-center justify-center ${ state ? 'block' : 'hidden'}`}>
      <div className="rounded-full animate-spin border-white size-[18px] border-[3px] border-solid border-t-transparent"></div>
    </div>
  );
}
