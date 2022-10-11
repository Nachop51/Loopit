const Content = ({ content, description, language }) => {
  const formatContent = (content) => {
    return content.split("\n").map((str) => (
      <span>
        {str}
        <br />
      </span>
    ));
  };

  return (
    <div className="loop-content">
      {description}
      <p>{formatContent(content)}</p>
    </div>
  );
};

export default Content;
