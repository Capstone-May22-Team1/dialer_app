const Phonecall = ({ call }) => {
  return (
    <li>
      <p>
        Number: {call.number}, Status: {call.status}
      </p>
    </li>
  );
};

export default Phonecall;
