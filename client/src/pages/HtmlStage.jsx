import React from 'react';
import { useMutation } from '@apollo/client';
import { COMPLETE_STAGE } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';

function HtmlStage() {
  const [completeStage] = useMutation(COMPLETE_STAGE);
  const navigate = useNavigate();

  const handleComplete = async () => {
    try {
      await completeStage({ variables: { stage: 'HTML' } });
      // Redirect to the next stage (CSS)
      navigate('/css');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>HTML Stage</h2>
      <p>Complete the challenge to unlock the next stage!</p>
      {/* Add HTML challenge logic here */}
      <button onClick={handleComplete}>Complete HTML Stage</button>
    </div>
  );
}

export default HtmlStage;
