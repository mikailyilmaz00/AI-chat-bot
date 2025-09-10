export default function Message({ text, role }) {
    return (

    <div className={`message ${role}`}>
        <p>{text}</p>
    </div>
    )
}