import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [hasError, setHasError] = useState<boolean>();
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) {
      setHasError(true);
      return;
    }

    const data = new FormData();
    uploadedFiles.forEach(file => {
      data.append('file', file.file, file.name);
    });
    try {
      await api.post('/transactions/import', data);
      setUploadedFiles([]);
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    setUploadedFiles(
      files.map(
        (file): FileProps => {
          // console.log(file);
          const kbytes = Math.ceil(file.size / 1024);
          setHasError(false);
          return {
            file,
            name: file.name,
            readableSize: `${kbytes} kbytes`,
          };
        },
      ),
    );
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {hasError && (
            <span style={{ color: '#ff0033' }}>
              Por favor, insira um ou mais arquivos
            </span>
          )}
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
