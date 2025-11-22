export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="max-w-[90vw] max-h-[90vh] w-auto h-auto"
      >
        <source src="/bleeth.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
