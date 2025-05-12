import UserForm from '../../components/UserForm';

const UserCreate = () => {
  return (
    <div className="container mx-auto p-6">
      <UserForm
        editingUser={false}
      />
    </div>
  );
};

export default UserCreate;
