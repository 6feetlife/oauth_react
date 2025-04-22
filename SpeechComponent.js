import React, { useState } from 'react';
import axios from 'axios';

function SpeechComponent() {
    const [text, setText] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);

    const handleRecognize = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const formData = new FormData();
            formData.append('audio', audioBlob);

            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
            console.log(formData);
            const response = await axios.post('http://localhost:8080/audio-records', formData, {
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const recognizedText = response.data.text;
            alert('음성 인식 결과:\n' + recognizedText);
        } catch (error) {
            console.error('음성 인식 요청 오류:', error);
        }
    };

    const handleGetTodaySchedule = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get('http://localhost:8080/main', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Today\'s Schedule:', response.data);
            alert('Today\'s schedule retrieved successfully!');
        } catch (error) {
            console.error('Failed to retrieve today\'s schedule:', error);
            alert('Failed to retrieve today\'s schedule.');
        }
    };

    return (
        <div>
            <h1>STT</h1>
            <hr/>
            <br/>
            <input type="text" value={text} onChange={e => setText(e.target.value)} />
            <input type="file" onChange={e => {
                const file = e.target.files[0];
                console.log("Selected file:", file);
                setAudioBlob(file);
            }} />
            <button onClick={handleRecognize}>음성 인식</button>
            <button onClick={handleGetTodaySchedule}>당일 일정 조회</button>
        </div>
    );
}

export default SpeechComponent; 