document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizForm');
    const perguntasContainer = document.getElementById('perguntas-container');
    const adicionarPerguntaBtn = document.getElementById('adicionar-pergunta');

    function criarOpcoesMultiplaEscolha(indice = 0) {
        return `
            <div class="opcao-multipla-escolha">
                <input type="text" name="opcao_${indice}" placeholder="Opção ${indice + 1}" required>
                <input type="radio" name="resposta_correta" value="${indice}" required> Resposta Correta
            </div>
        `;
    }

    function adicionarPergunta() {
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('pergunta');
        
        const totalPerguntas = perguntasContainer.children.length;
        
        perguntaDiv.innerHTML = `
            <button type="button" class="remover-botao">Remover Pergunta</button>
            
            <div class="config-linha">
                <label>Texto da Pergunta:</label>
                <input type="text" name="pergunta_texto_${totalPerguntas}" required>
            </div>
            
            <div class="config-linha">
                <label>Tipo de Pergunta:</label>
                <select name="pergunta_tipo_${totalPerguntas}" class="tipo-pergunta">
                    <option value="multiple_choice">Múltipla Escolha</option>
                    <option value="true_false">Verdadeiro ou Falso</option>
                    <option value="open">Pergunta Aberta</option>
                </select>
            </div>
            
            <div class="opcoes-container">
                ${criarOpcoesMultiplaEscolha(0)}
                ${criarOpcoesMultiplaEscolha(1)}
                ${criarOpcoesMultiplaEscolha(2)}
                ${criarOpcoesMultiplaEscolha(3)}
            </div>
        `;

        const removerBtn = perguntaDiv.querySelector('.remover-botao');
        removerBtn.addEventListener('click', () => {
            perguntasContainer.removeChild(perguntaDiv);
        });

        const tipoSelect = perguntaDiv.querySelector('.tipo-pergunta');
        const opcoesContainer = perguntaDiv.querySelector('.opcoes-container');
        
        tipoSelect.addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'multiple_choice':
                    opcoesContainer.innerHTML = `
                        ${criarOpcoesMultiplaEscolha(0)}
                        ${criarOpcoesMultiplaEscolha(1)}
                        ${criarOpcoesMultiplaEscolha(2)}
                        ${criarOpcoesMultiplaEscolha(3)}
                    `;
                    break;
                case 'true_false':
                    opcoesContainer.innerHTML = `
                        <div>
                            <input type="radio" name="resposta_correta" value="true" required> Verdadeiro
                            <input type="radio" name="resposta_correta" value="false" required> Falso
                        </div>
                    `;
                    break;
                case 'open':
                    opcoesContainer.innerHTML = `
                        <textarea name="criterios_resposta" placeholder="Critérios para resposta aberta" rows="3"></textarea>
                    `;
                    break;
            }
        });

        perguntasContainer.appendChild(perguntaDiv);
    }

    adicionarPergunta();
    adicionarPerguntaBtn.addEventListener('click', adicionarPergunta);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        const quizConfig = {
            quiz: {
                titulo: formData.get('quiz-titulo'),
                perguntas: []
            },
            configuracao: {
                parametros: [
                    {
                        id: 'quiz_title',
                        value: formData.get('quiz-titulo')
                    },
                    {
                        id: 'question_count',
                        value: parseInt(formData.get('numero-questoes'))
                    },
                    {
                        id: 'time_limit',
                        value: parseInt(formData.get('tempo-limite'))
                    },
                    {
                        id: 'question_types',
                        value: Array.from(formData.getAll('tipos-questoes'))
                    },
                    {
                        id: 'passing_score',
                        value: parseFloat(formData.get('pontuacao-minima'))
                    }
                ]
            },
            user_url_info: {
                deploymentConfiguration: {
                    attemptLimit: parseInt(formData.get('tentativas-limite')),
                    timeLimit: parseInt(formData.get('tempo-limite')) * 60,
                    startDate: formData.get('data-inicio'),
                    endDate: formData.get('data-fim')
                }
            }
        };

        perguntasContainer.querySelectorAll('.pergunta').forEach((perguntaEl, index) => {
            const pergunta = {
                texto: formData.get(`pergunta_texto_${index}`),
                tipo: formData.get(`pergunta_tipo_${index}`)
            };

            switch(pergunta.tipo) {
                case 'multiple_choice':
                    pergunta.opcoes = [
                        formData.get('opcao_0'),
                        formData.get('opcao_1'),
                        formData.get('opcao_2'),
                        formData.get('opcao_3')
                    ];
                    pergunta.respostaCorreta = formData.get('resposta_correta');
                    break;
                case 'true_false':
                    pergunta.respostaCorreta = formData.get('resposta_correta');
                    break;
                case 'open':
                    pergunta.criterios = formData.get('criterios_resposta');
                    break;
            }

            quizConfig.quiz.perguntas.push(pergunta);
        });

        console.log(JSON.stringify(quizConfig, null, 2));
        localStorage.setItem('quizConfig', JSON.stringify(quizConfig));
        alert('Configuração do Quiz salva com sucesso!');
    });
});
