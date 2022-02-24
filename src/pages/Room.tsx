import { FormEvent ,useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { questions, title } = useRoom(roomId);
    const [ newQuestion, setNewQuestion ] = useState('');


    async function handleCreateQuestion(event: FormEvent) {
        event.preventDefault();

       if (newQuestion.trim() === '') {
           return;
       }

       if (!user) {
           throw new Error("Você deve estar logado para fazer uma pergunta.");
       }

       const question = {
           content: newQuestion,
           author: {
               name: user?.name,
               avatar: user?.avatar
           },
           isHighlitghted: false,
           isAnswered: false
       }

        await database.ref(`rooms/${roomId}/questions`).push(question);
        
        setNewQuestion('');
   }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo LetmeAsk" />
                    <RoomCode code={params.id}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && 
                        <span>{questions.length} pergunta(s)</span>
                    }
                </div>

                <form onSubmit={handleCreateQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>  
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>                                
                        ) }
                        
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                
                <div className="question-list">
                {questions.map(question => {
                    return (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        />       
                    )    
                })}
                </div>
            </main>
        </div>
    );
}