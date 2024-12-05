document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizForm');
    const perguntasContainer = document.getElementById('perguntas');
    const adicionarPerguntaBtn = document.getElementById('adicionarPergunta');

    function criarOpcaoMultiplaEscolha(indice = 0) {
        return `
            <div class="opcao">
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
            <button type="button" class="remover-pergunta">Remover Pergunta</button>
            <label>Texto da Pergunta:</label>
            <input type="text" name="pergunta_${totalPerguntas}" required>
            
            <label>Tipo de Pergunta:</label>
            <select name="tipo_${totalPerguntas}" class="tipo-pergunta">
                <option value="multiple_choice">Múltipla Escolha</option>
                <option value="true_false">Verdadeiro ou Falso</option>
                <option value="open">Pergunta Aberta</option>
            </select>
            
            <div class="opcoes">
                ${criarOpcaoMultiplaEscolha(0)}
                ${criarOpcaoMultiplaEscolha(1)}
                ${criarOpcaoMultiplaEscolha(2)}
                ${criarOpcaoMultiplaEscolha(3)}
            </div>
        `;

        perguntaDiv.querySelector('.remover-pergunta').addEventListener('click', () => {
            perguntasContainer.removeChild(perguntaDiv);
        });

        const tipoSelect = perguntaDiv.querySelector('.tipo-pergunta');
        const opcoesContainer = perguntaDiv.querySelector('.opcoes');
        
        tipoSelect.addEventListener('change', (e) => {
            switch(e.target.value) {
                case 'multiple_choice':
                    opcoesContainer.innerHTML = `
                        ${criarOpcaoMultiplaEscolha(0)}
                        ${criarOpcaoMultiplaEscolha(1)}
                        ${criarOpcaoMultiplaEscolha(2)}
                        ${criarOpcaoMultiplaEscolha(3)}
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
                        <textarea name="resposta_aberta" placeholder="Critérios para resposta aberta" rows="3"></textarea>
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
        const quizData = {
            titulo: formData.get('titulo'),
            perguntas: []
        };

        perguntasContainer.querySelectorAll('.pergunta').forEach((perguntaEl, index) => {
            const pergunta = {
                texto: formData.get(`pergunta_${index}`),
                tipo: formData.get(`tipo_${index}`),
            };

            switch(pergunta.tipo) {
                case 'multiple_choice':
                    pergunta.opcoes = [
                        formData.get(`opcao_0`),
                        formData.get(`opcao_1`),
                        formData.get(`opcao_2`),
                        formData.get(`opcao_3`)
                    ];
                    pergunta.respostaCorreta = formData.get('resposta_correta');
                    break;
                case 'true_false':
                    pergunta.respostaCorreta = formData.get('resposta_correta');
                    break;
                case 'open':
                    pergunta.criterios = formData.get('resposta_aberta');
                    break;
            }

            quizData.perguntas.push(pergunta);
        });

        console.log(JSON.stringify(quizData, null, 2));
        localStorage.setItem('quizConfig', JSON.stringify(quizData));
        alert('Quiz salvo com sucesso!');
    });
});
