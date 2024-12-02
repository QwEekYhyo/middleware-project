using System.Reflection;

public abstract class JSONObject {
    public override string ToString() {
        // Use reflection to get all public properties
        var members = this.GetType()
                          .GetMembers(BindingFlags.Public | BindingFlags.Instance)
                          .Where(m => m.MemberType == MemberTypes.Property);

        string res = string.Join(",\n", members.Select(member => {
            var name = member.Name;
            var value = ((PropertyInfo) member).GetValue(this)?.ToString() ?? "null";
            return $"\t\"{name}\":\"{value}\"";
        }));

        return $@"
    {{
{res}
    }},";
    }
}
