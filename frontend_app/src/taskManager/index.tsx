import React, { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import useTasks, { CustomTask } from "./useTasks";
import TasksList from "./TasksList";
import AddOrEditDialog from "./AddOrEditDialog";

const { Content } = Layout;

const TaskManager = () => {
    const { tasks, addOrUpdateTask } = useTasks();
    const [editingTask, setEditingTask] = useState<CustomTask | undefined>();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        resetForm();
    }, [tasks]);

    const startEditing = (task: CustomTask) => {
        setEditingTask(task);
        setModalVisible(true);
    };

    const resetForm = () => {
        setEditingTask(undefined);
        setModalVisible(false);
    };

    const onSave = (updatedTask: CustomTask) => {
        if (!updatedTask?.title.trim()) return;

        const newTask = {
            id: editingTask ? editingTask.id : tasks.length + 1,
            title: updatedTask.title,
            description: updatedTask.description,
            status: "pending",
        };

        addOrUpdateTask(newTask).then(resetForm);
    };

    return (
        <Layout style={{ minHeight: "100vh", padding: "20px", background: "#fff" }}>
            <Content
                style={{
                    maxWidth: "800px",  // Increased width
                    width: "100%",  
                    margin: "auto",
                    padding: "20px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <TasksList tasks={tasks} onEdit={startEditing} />
                <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginTop: "20px", width: "100%" }}>
                    Add Task
                </Button>

                <AddOrEditDialog visible={modalVisible} task={editingTask} onSave={onSave} onCancel={resetForm} />
            </Content>
        </Layout>
    );
};

export default TaskManager;
