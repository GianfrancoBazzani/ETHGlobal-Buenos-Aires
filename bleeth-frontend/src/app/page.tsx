export default function Home() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-black overflow-hidden">
      
      <div className="flex items-center justify-center w-full h-full">
        <img src="/frame.avif" alt="Bleeth" className="w-32 h-full " />
        <div className="w-full h-full bg-black/50 flex items-center justify-center flex-col">
        <video
        autoPlay
        muted
        playsInline
        className="max-w-[90vw] max-h-[200px] w-auto h-auto"
      >
        <source src="/bleeth.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video></div>
        <img src="/frame.avif" alt="Bleeth" className="w-32 h-full rotate-180" />
      </div>
    </div>
  );
}
