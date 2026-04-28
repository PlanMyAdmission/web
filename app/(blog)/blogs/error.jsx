'use client';

const BlogsError = ({ reset }) => (
  <div className="mx-auto mt-10 max-w-3xl rounded-xl bg-light px-6 py-10 text-center">
    <h1 className="text-2xl font-semibold text-[#3f1831]">
      We couldn't load the blog right now
    </h1>
    <p className="mt-3 text-[#6f556f]">
      Something went wrong reaching our content service. Please try again in a
      moment.
    </p>
    <button
      type="button"
      onClick={reset}
      className="mt-6 rounded-full bg-main px-5 py-2 text-white"
    >
      Try again
    </button>
  </div>
);

export default BlogsError;
