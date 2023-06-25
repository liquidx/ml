import os
from apikey import apikey
import streamlit as st
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain, SimpleSequentialChain, SequentialChain
from langchain.memory import ConversationBufferMemory
from langchain.utilities import WikipediaAPIWrapper

os.environ['OPENAI_API_KEY'] = apikey


def main():
    st.title('Email Generator')
    prompt = st.text_area('Purpose', '')

    # Prompt template
    subject_template = PromptTemplate(
        input_variables=['topic'],
        template='Write a subject for an email about {topic}.'
    )

    body_template = PromptTemplate(
        input_variables=['subject', 'wikipedia_content'],
        template='Write an email with the subject {subject} given this wikipedia content: {wikipedia_content}.'
    )

    # Memory
    subject_memory = ConversationBufferMemory(
        input_key='topic', memory_key='chat_history')
    body_memory = ConversationBufferMemory(
        input_key='subject', memory_key='chat_history')

    #
    wiki = WikipediaAPIWrapper()

    # LLMs
    llm = OpenAI(temperature=0.9)
    subject_chain = LLMChain(
        llm=llm,
        prompt=subject_template,
        memory=subject_memory,
        output_key='subject', verbose=True)
    body_chain = LLMChain(llm=llm,
                          prompt=body_template,
                          memory=body_memory,
                          output_key='body',
                          verbose=True)

    if prompt:
        subject = subject_chain.run(topic=prompt)
        wikipedia_content = wiki.run(prompt)
        body = body_chain.run(
            subject=subject, wikipedia_content=wikipedia_content)

        st.write(subject)
        st.write(body)

        with st.expander('Subject History'):
            st.info(subject_memory.buffer)

        with st.expander('Body History'):
            st.info(body_memory.buffer)

        with st.expander('Wikipedia Content'):
            st.info(wikipedia_content)


if __name__ == '__main__':
    main()
