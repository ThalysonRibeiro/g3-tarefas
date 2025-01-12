import Head from "next/head";
import styles from "./styles.module.css";
import { GetServerSideProps } from "next";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Textarea } from "@/components/textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";

interface TaskProps {
  item: {
    tarefa: string;
    public: boolean;
    created: string;
    user: string;
    taskId: string;
  };
  allComments: CommentsProps[];
}

interface CommentsProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComments }: TaskProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentsProps[]>(allComments || []);

  async function handleComent(event: FormEvent) {
    event.preventDefault();
    if (input === "") return;

    if (!session?.user?.email || !session?.user.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input, // Fixed: changed from 'commets' to 'comment'
        created: new Date(),
        user: session?.user.email,
        name: session?.user.name,
        taskId: item?.taskId,
      });

      // Add the new comment to the local state
      const newComment: CommentsProps = {
        id: docRef.id,
        comment: input,
        user: session.user.email,
        name: session.user.name,
        taskId: item.taskId,
      };

      setComments([...comments, newComment]);
      setInput("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);

      const deleteComment = comments.filter((item) => item.id !== id);

      setComments(deleteComment);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Detalhes da tarefa</title>
      </Head>
      <main className={styles.main}>
        <h1>Tarefa</h1>
        <article className={styles.task}>
          <p>{item.tarefa}</p>
        </article>
      </main>

      <section className={styles.commentsContainer}>
        <h2>Deixar comentários</h2>
        <form onSubmit={handleComent}>
          <Textarea
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
            placeholder="Digite seu comentário"
          />
          <button disabled={!session?.user} className={styles.button}>
            Enviar comentário {/* Fixed typo in button text */}
          </button>
        </form>
      </section>

      <section className={styles.commentsContainer}>
        <h2>Todos os comentários</h2>
        {comments.length === 0 && (
          <span>Nenhum comentário foi encontrado...</span>
        )}

        {comments.map((item) => (
          <article key={item.id} className={styles.comment}>
            <div className={styles.headComment}>
              <label className={styles.commentsLabel}>{item.name}</label>
              {item.user === session?.user?.email && (
                <button onClick={() => handleDeleteComment(item.id)}
                  className={styles.buttonTrash}>
                  <FaTrash size={18} color="#ff004c" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;
  const docRef = doc(db, "tarefas", id);

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentsProps[] = [];

  snapshotComments.forEach((doc) => {
    // Only add comments that have valid data
    const data = doc.data();
    if (data?.comment) { // Make sure comment exists
      allComments.push({
        id: doc.id,
        comment: data.comment,
        user: data.user || '',
        name: data.name || '',
        taskId: data.taskId || id
      });
    }
  });

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.seconds * 1000;

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComments: allComments,
    },
  };
};